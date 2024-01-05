import { userRepository } from './user.repository';

it('setUser', async () => {
    return await userRepository(async ({ setOne }) => {
        return await setOne('sid.dev', { id: 'sid.dev', access_token: 'abc' });
    });
});

it('getUser', async () => {
    return await userRepository(async ({ getOne }) => {
        return await getOne('sid.dev');
    });
});
