module.exports = ({ el, services, subscriptions, util }) => () => {

    const $import = el('button', 'import', { textContent: 'Import' })
        .addEventListener('click', () => {
            const { emails, fallback } = services.settings.getGravatar();
            services.tags.insertGravatarBatchAsync(emails, fallback);
        });

    subscriptions.settings.gravatar.onChange('status', () => {
        util.toggleBoolClass($import, 'visible', services.gravatar.status.is.ready());
    }).invoke();

    subscriptions.settings.gravatar.onChange('freetext', freetext => {
        $import.disabled = !freetext.trim();
    }).invoke();

    return $import;

};