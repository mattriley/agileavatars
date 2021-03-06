module.exports = ({ test, boot }) => {

    test('return profile on successful response', async t => {
        const profile = { name: { givenName: 'given' }, displayName: 'display' };
        const json = { entry: [profile] };
        const fetch = url => {
            t.equal(url, 'https://secure.gravatar.com/f3ada405ce890b6f8204094deb12d8a8.json');
            return { ok: true, json: () => json };
        };
        const io = { fetch };
        const { services } = boot({ io });
        const actualProfile = await services.gravatar.fetchProfileAsync('foo@bar.com');
        t.equal(actualProfile, profile);
    });

    test('return empty profile when email is null', async t => {
        const { services } = boot();
        const profile = await services.gravatar.fetchProfileAsync(null);
        t.equal(profile, {});
    });

    test('return empty profile on 404 not found', async t => {
        const fetch = () => ({ status: 404 });
        const io = { fetch };
        const { services } = boot({ io });
        const profile = await services.gravatar.fetchProfileAsync('foo@bar.com');
        t.equal(profile, {});
    });

    test('throw on unexpected response status', async t => {
        const fetch = () => ({ ok: false, status: 500 });
        const io = { fetch };
        const { services } = boot({ io });
        try {
            await services.gravatar.fetchProfileAsync('foo@bar.com');
            t.fail();
        } catch (err) {
            t.equal(err.message, 'Unexpected Gravatar response status 500.');
        }
    });

};
