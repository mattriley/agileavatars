const composer = require('module-composer');

const modules = {
    core: require('./core'),
    services: require('./services')
};

module.exports = ({ subscriptions, stores, io, util, config, overrides }) => {

    const compose = composer(modules, { overrides });
    const core = compose('core', { util, config });
    const services = compose('services', { subscriptions, stores, core, io, util, config });
    return { core, services };

};
