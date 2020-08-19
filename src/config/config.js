module.exports = ({ window }) => {

    const meta = name => window.document.querySelector(`meta[name=${name}]`)?.getAttribute('content');

    const maxImageSize = 600;
    const isLocalhost = (/localhost/).test(window.location.host);

    return {
        googleAnalytics: {                
            trackingId: 'UA-34497639-2',
            enabled: !isLocalhost
        },
        sentry: {
            dsn: 'https://63594154fcf34c34966aec13b15e2821@o418187.ingest.sentry.io/5320412',
            enabled: !isLocalhost
        },
        app: {
            name: meta('title'),
            issues: 'https://github.com/mattriley/agileavatars/issues'
        },
        author: {
            name: meta('author'),
            profile: 'https://www.linkedin.com/in/mattrileyau/'
        },
        gravatar: {
            domain: 'https://secure.gravatar.com',
            size: maxImageSize,
            fallbacks: ['robohash', 'monsterid', 'wavatar', 'retro', 'identicon', 'mp'],
            errorMessage: 'An error occurred. Please check your connection and try again.'
        },
        options: {
            layout: 'modes | shapes | size | spacing | sort | outline',
            modes: ['active', 'passive'],
            shapes: ['circle', 'square'],
            shapeRadius: { circle: 50, square: 0 },
            active: { min: 0, max: 999, step: 1 },
            passive: { min: 0, max: 999, step: 1 },
            size: { min: 1, max: maxImageSize, step: 10 },
            spacing: { min: 0, max: 10, step: 1 },
            sort: {
                orderAdded: 'Order added',
                roleThenName: 'Role, then name',
                name: 'Name'
            }
        },
        tags: {
            layout: 'tagImage | tagName roleName',
            imagePadding: 17
        },
        roles: {
            nilRole: { roleName: '', color: '#ffffff' },
            presetColors: {
                BA: '#6688c3',
                DEV: '#48a56a',
                PO: '#ce4a4a',
                QA: '#eaaf41',
                TL: '#000000',
                XD: '#b25da6'
            }
        },
        debounce: {
            adjustTagInstanceCounts: 100,
            sortTagList: 50
        },
        storage: {
            stores: ['settings', 'roles', 'tags', 'tagInstances'],
            settings: ['app', 'options', 'gravatar']
        },
        defaultSettings: {
            app: {
                modal: 'welcome',
                nilRoleId: null
            },
            options: {
                sort: 'orderAdded',
                shape: 'circle',
                active: 1,
                passive: 0,
                size: 175,
                spacing: 4,
                outline: true
            },
            gravatar: {
                fallback: 'robohash',
                freetext: '',
                status: 'ready',
                errorMessage: ''
            }             
        }
    };
};