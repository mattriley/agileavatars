const stateStore = require('./state-store');

module.exports = ({ util, config }) => {

    const { stores, subscriptions } = config.storage.stores.reduce((acc, name) => {
        const defaults = config.storage.defaults[name];
        const { subscriptions, ...store } = stateStore(defaults);
        acc.subscriptions[name] = subscriptions;
        acc.stores[name] = store;    
        return acc;
    }, { stores: {}, subscriptions: {} });

    const getState = () => util.mapValues(stores, store => store.list());

    return { stores, subscriptions, getState };

};