import { AuthenticateUserDTO, CreateUserDTO, UserRole } from './auth.types';
import Boom from '@hapi/boom';
import { supabase } from '../../config/supabase';
import { AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js';

export const authenticateUserService = async (
  credentials: AuthenticateUserDTO
): Promise<AuthTokenResponsePassword['data']> => {
  const signInResponse = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (signInResponse.error) {
    throw Boom.unauthorized(signInResponse.error.message);
  }

  return signInResponse.data;
};

export const createUserService = async (
  user: CreateUserDTO
): Promise<AuthResponse['data']> => {
  const signUpResponse = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        name: user.name,
        role: user.role,
      },
    },
  });

  if (signUpResponse.error) {
    throw Boom.badRequest(signUpResponse.error.message);
  }

  const newUserId = signUpResponse.data.user?.id;

  if (user.role === UserRole.STORE && user.storeName && newUserId) {
    const { error: storeError } = await supabase.from('stores').insert([
      {
        name: user.storeName,
        ownerId: newUserId,
        status: 'closed',
      },
    ]);

    if (storeError) {
      throw Boom.internal(
        'User was created, but failed to create the store: ' +
          storeError.message
      );
    }
  }

  return signUpResponse.data;
};
