import { AuthorizationCode } from 'simple-oauth2';

import { config } from '../config';
import { API_VER } from './facebook.const';
import { User, userRepository } from './user.repository';

const oauth2 = new AuthorizationCode({
    client: {
        id: config().FACEBOOK_CLIENT_ID!,
        secret: config().FACEBOOK_CLIENT_SECRET!,
    },
    auth: {
        authorizeHost: `https://www.facebook.com/${API_VER}/dialog/oauth`,
        authorizePath: `https://www.facebook.com/${API_VER}/dialog/oauth`,
        tokenHost: `https://graph.facebook.com/${API_VER}/oauth/access_token`,
        tokenPath: `https://graph.facebook.com/${API_VER}/oauth/access_token`,
    },
});

const redirectURI = `${config().PUBLIC_URL!}/callback`;

export type GetAuthorizationURLOptions = { state?: string };

export const getAuthorizationURL = ({ state }: GetAuthorizationURLOptions) => {
    return oauth2.authorizeURL({
        redirect_uri: redirectURI,
        scope: ['openid', 'public_profile', 'business_management', 'ads_read', 'ads_management', 'read_insights'],
        state,
    });
};

export type HandleAuthorizationCallbackOptions = {
    code: string;
    state: string;
};

export const handleAuthorizationCallback = async (options: HandleAuthorizationCallbackOptions) => {
    const { code, state } = options;
    const accessToken = await oauth2.getToken({
        code,
        redirect_uri: redirectURI,
    });
    return await userRepository(({ setOne }) => setOne(state, accessToken.token as User));
};
