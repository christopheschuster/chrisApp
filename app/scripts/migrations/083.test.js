import { v4 } from 'uuid';
import { migrate, version } from './083';

const sentryCaptureExceptionMock = jest.fn();

global.sentry = {
  captureException: sentryCaptureExceptionMock,
};

jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: jest.fn(),
  };
});

describe('migration #83', () => {
  beforeEach(() => {
    v4.mockImplementationOnce(() => 'network-configuration-id-1')
      .mockImplementationOnce(() => 'network-configuration-id-2')
      .mockImplementationOnce(() => 'network-configuration-id-4');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update the version metadata', async () => {
    const oldStorage = { meta: { version: 82 }, data: {} };
    const newStorage = await migrate(oldStorage);
    expect(newStorage.meta).toStrictEqual({ version });
  });

  it('should use the key of the networkConfigurations object to set the id of each network configuration', async () => {
    const oldStorage = {
      meta: { version },
      data: {
        NetworkController: {
          networkConfigurations: {
            'network-configuration-id-1': { chainId: '0x539', nickname: 'Localhost 8545', rpcPrefs: {}, rpcUrl:'http://localhost:8545', ticker:'ETH' },
            'network-configuration-id-2': { chainId:'0xa4b1', nickname:'Arbitrum One',
              rpcPrefs:{ blockExplorerUrl:'https://explorer.arbitrum.io' },
              rpcUrl:'https://arbitrum-mainnet.infura.io/v3/373266a93aab4acda48f89d4fe77c748',
              ticker:'ETH'
            },
            'network-configuration-id-4': { chainId:'0x38',
              nickname:'BNB Smart Chain (previously Binance Smart Chain Mainnet)',
              rpcPrefs:{ blockExplorerUrl:'https://bscscan.com/' }, 
              rpcUrl:'https://bsc-dataseed.binance.org/',
              ticker:'BNB'
            }
          }
        }
      }
    };

    const newStorage = await migrate(oldStorage);

    expect(newStorage).toStrictEqual({
      meta:{ version },
      data:{
        NetworkController:{
          networkConfigurations:{
            'network-configuration-id-1':{ chainId:"0x539", nickname:"Localhost 8545", rpcPrefs:{}, rpcUrl:"http://localhost:8545", ticker:"ETH", id:"network-configuration-id-1" },
            'network-configuration-id-2':{ chainId:"0xa4b1", nickname:"Arbitrum One",
               rpcPrefs:{ blockExplorerUrl:"https://explorer.arbitrum.io" }, 
               rpcUrl:"https://arbitrum-mainnet.infura.io/v3/373266a93aab4acda48f89d4fe77c748",
               ticker:"ETH",
               id:"network-configuration-id-2"
             },
             'network-configuration-id-4':{ chainId:"0x38",
                nickname:
                  "BNB Smart Chain (previously Binance Smart Chain Mainnet)",
                rpcPrefs:{ blockExplorerUrl:"https://bscscan.com/" }, 
                rpcUrl:
                  "https://bsc-dataseed.binance.org/",
                ticker:
                  "BNB",
                id:
                  "network-configuration-id-4"
             }
          }
        }
      }
   });
 });

 it('should not modify state if state.NetworkController is undefined or not an object and capture exceptions accordingly', async () => {

   let oldStorage = { meta:{version}, data:{ testProperty : "testValue" }};
   let newStorage;

   newStorage=await migrate(oldStorage);
   expect(newStorage).toStrictEqual(oldStorage);
   expect(sentryCaptureExceptionMock).toHaveBeenCalledWith(new Error("typeof state.NetworkController is undefined"));

   sentryCaptureExceptionMock.mockClear();

   oldStorage={meta:{version},data:{NetworkController:false,testProperty :"testValue"}};
   
   newStorage=await migrate(oldStorage);
   
   expect(newStorage).toStrictEqual(oldStorage);
   
   expect(sentryCaptureExceptionMock).toHaveBeenCalledWith(new Error("typeof state.NetworkController is boolean"));
});

it('should not modify state if NetworkController.networkConfigurations is undefined or empty and capture exceptions accordingly', async () =>{
  
 let oldState={meta:{version},
             data:{
                   NetworkController:{
                      testNetworkControllerProperty :"testNetworkControllerValue",
                      networkConfigurations : undefined
                   },
                   testProperty :"testValue"
                 }};

 let result=await migrate(oldState);

 expect(result).toStrictEqual(oldState);

 expect(sentryCaptureExceptionMock).toHaveBeenCalledWith(
     new Error("typeof NetworkController.networkConfigurations is undefined")
 );

 sentryCaptureExceptionMock.mockClear();

 // Now with empty object for networkConfigurations

 oldState={meta :{version},
           data:{
                 NetworkController:{
                    testNetworkControllerProperty :"testNetworkControllerValue",
                    networkConfigurations : {}
                 },
                 testProperty :"testValue"
               }};

 result=await migrate(oldState);

 // Should remain unchanged and no exception captured
 expect(result).toStrictEqual(oldState);
expect(sentryCaptureExceptionMock).not.toHaveBeenCalled();

});

});
