import Head from "next/head";
import "../styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
    window.gtag('config', GA_TRACKING_ID, {
        page_path: url,
    })
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({action, category, label, value}) => {
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
    })
};

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

const title = "BrainDAO OraQles";
const description = "BrainDAO brings real-world information onto the blockchain with our innovative OraQle product. Try it on Ethereum today.";

function MyApp({Component, pageProps}) {

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="og:title" key="og:title" content={title}/>
                <meta name="twitter:title" key="twitter:title" content={title}/>
                <meta name="description" key="description" content={description}/>
                <meta
                    name="og:description"
                    key="og:description"
                    content={description}
                />
                <link
                    rel="icon"
                    href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/flag-for-united-states_1f1fa-1f1f8.png"
                />
                <meta
                    name="twitter:description"
                    key="twitter:description"
                    content={description}
                />
                {/* <meta name="twitter:image" key="twitter:image" content={previewImageSrc} /> */}
                {/* <meta name="twitter:card" key="twitter:card" content="summary_large_image" /> */}
                {/* <meta name="og:image" key="og:image" content={`https://everipedia.org${previewImageSrc}`} /> */}
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_TRACKING_ID}', {
                          page_path: window.location.pathname,
                        });
                      `,
                    }}
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
