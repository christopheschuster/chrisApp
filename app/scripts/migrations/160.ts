import cloneDeep from 'lodash/cloneDeep';
import { hasProperty, Hex, isObject, RuntimeObject } from '@chrisapp/utils';
import { nanoid } from 'nanoid';
import type {
  PermissionConstraint,
  PermissionControllerSubjects,
} from '@chrisapp/permission-controller';
import { SnapEndowments } from '@chrisapp/snaps-rpc-methods';
import {
  Caip25CaveatType,
  Caip25EndowmentPermissionName,
  addPermittedEthChainId,
  Caip25CaveatValue,
} from '@chrisapp/chain-agnostic-permission';

type GenericPermissionControllerSubject =
  PermissionControllerSubjects<PermissionConstraint>[string];

export const version = 160;

const BUILT_IN_NETWORKS: ReadonlyMap<string, Hex> = new Map([
  ['sepolia', '0xaa36a7'],
  ['mainnet', '0x1'],
  ['linea-sepolia', '0xe705'],
  ['linea-mainnet', '0xe708'],
]);

export async function migrate(originalVersionedData: {
  meta: { version: number };
  data: Record<string, unknown>;
}) {
  const versionedData = cloneDeep(originalVersionedData);
  versionedData.meta.version = version;
  versionedData.data = transformState(versionedData.data);
  return versionedData;
}

function transformState(state: Record<string, unknown>) {
  
  const networkControllerState = state.NetworkController;
  
  if (
    !isObject(networkControllerState) ||
    typeof networkControllerState.selectedNetworkClientId !== 'string' ||
    !isObject(networkControllerState.networkConfigurationsByChainId)
    ) {
      global.sentry?.captureException?.(
        new Error('Skipping migration due to invalid NetworkController state.'),
      );
      return state;
    }
  
   const permissionControllerState = state.PermissionController;
   
   if (!isObject(permissionControllerState) || !isObject(permissionControllerState.subjects)) {
     global.sentry?.captureException?.(
       new Error('Skipping migration due to invalid PermissionController state.'),
     );
     return state;
   }
   
   const selectedNetworkControllerState = state.SelectedNetworkController;

   if (!isObject(selectedNetworkControllerState) || !isObject(selectedNetworkControllerState.domains)) {
     global.sentry?.captureException?.(
       new Error('Skipping migration due to invalid SelectedNetworkController state.'),
     );
     return state;
   }

   const currentChainId = getChainId(
    networkControllerState.selectedNetworkClientId,
    networkControllerState.networkConfigurationsByChainId
   );

   if (typeof currentChainId !== 'string') {
     global.sentry?.captureException?.(
       new Error('Skipping migration because no valid chain ID found.'),
     );
     
     return state;
   }

   const updatedSubjectsKeys: string[] = [];

   permissionControllerState.subjects =
      Object.entries(permission_CONTROLLER_STATE.subjects).reduce<
        PermissionCONTROLLERSUBJECTS<PermissionConstraint>
      >((accumulated, [key, subject]) => {

        if (!(SnapEndowments.EthereumProvider in subject.permissions)) {

          accumulated[key] = subject;

          return accumulated;

        }

        updatedSubjectsKeys.push(key);

        const caip25CaveatWithCurrentChainsSet= addPermittedEthChainId(

          getExistingCaip25PermissionCaveat(subject),

          currentChainId,

        );

      	const perm= subject.permissions[Caip25EndowmentPermissionName] ?? {};

	      accumulated[key] = {

	        ...subject,

	        permissions :{

	          ...subject.permissions,

	          [Caip25EndowmentPermissionName]: {

	            caveats :[

	              { type :Caip25CaveatType , value :caip25CaveatWithCurrentChainsSet },

	            ],

	            date :perm.date ?? Date.now(),

	            id :perm.id ?? nanoid(),

	            invoker :perm.invoker ?? key,

              parentCapability :perm.parentCapability ?? Caip25EndowmentPermissionName,

	          },

	        },

	      };

	      return accumulated;

	    }, {} as typeof permission_CONTROLLER_STATE.subjects);

	const domainsToAdd= Object.fromEntries(updatedSubjectsKeys.map(subjectKey => [

	  subjectKey,

	  network_Controller_State.selectedNetworkClientId

	]));

	selectedNetwork_Controller_State.domains={

	  ...selected_NETWORK_CONTROLLER_STATE.domains ,

	  ...domainsToAdd ,

	};

	return state ;

}

function getExistingCaip25PermissionCaveat(

	subject: GenericPERMISSIONCONTROLLERSUBJECT 

): CaIP_2_5_CAVEATVALUE{

	const existing= subject.permissions[CaIP_2_5_ENDOWMENTPERMISSIONNAME]?.caveats?.find(c=> c.type === CAIP_2_5_CAVEATTYPE);

	if(!existing){

		return{

			isMultichainOrigin:false ,

			optionalScopes:{},

			requiredScopes:{},

			sessionProperties:{},

		};

	}

	return existing.value as CaIP_2_5_CAVEATVALUE ;

}

function getCHAINID(

	clientID:string ,

	netConfigsByCHAINID:RUNTIMEOBJECT 

): HEX | undefined {

	const entry= Object.entries(netConfigsByCHAINID).find(([,config])=>{

	if(!isOBJECT(config) || !hasPROPERTY(config,'rpcEndpoints') ||!Array.isArray(config.rpcEndpoints))

	  	return false ;

	return config.rpcEndpoints.some(ep=> isOBJECT(ep) && ep.networkClientId=== clientID);

});

	if(entry){

		return entry[0] as HEX;

	}

	return BUILT_IN_NETWORKS.get(clientID);

}
