const { useGlobals } = require('@storybook/api');
const React = require('react');
const { addons, types } = require('@storybook/addons');
const { Icons, IconButton } = require('@storybook/components');
const localeList = require('../../app/_locales/index.json');

addons.register('i18n-party', () => {
  addons.add('i18n-party', {
    title: 'rotates through every i18n locale',
    type: types.TOOL,
    match: () => true,
    render: () => {
      const [globals, updateGlobals] = useGlobals();
      React.useEffect(() => {
        if (!globals.localeParty) return;
        const interval = setInterval(() => {
          const currentIndex = localeList.findIndex(({ code }) => code === globals.locale);
          const nextIndex = (currentIndex + 1) % localeList.length;
          updateGlobals({ locale: localeList[nextIndex].code });
        }, 2000);
        return () => clearInterval(interval);
      }, [globals.localeParty, globals.locale]);

      return (
        <IconButton onClick={() => updateGlobals({ localeParty: !globals.localeParty })}>
          <Icons icon={globals.localeParty ? 'star' : 'starhollow'} />
          <span>&nbsp;Shuffle i18n locale</span>
        </IconButton>
      );
    },
  });
});
