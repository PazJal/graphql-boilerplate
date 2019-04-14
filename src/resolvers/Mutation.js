import bcrypt from 'bcryptjs';

import hashPassword from '../utils/hashPassword';
import getUserId from '../utils/getUserId';
import generateToken from '../utils/generateToken';

const Mutation = {
  async login(parent, args, {prisma}, info) {
    const {email , password} = args.data;
    const user = await prisma.query.user({
      where: {
        email
      }
    });

    if(!user) {
      throw new Error(`No match found for ${email}`);
    }

    const userVerified = await bcrypt.compare(password, user.password);

    if(!userVerified){
      throw new Error(`Password verification faild.`);
    }

    return {
      user,
      token: generateToken(user.id)
    }
  },


  async createUser(parent , args , {prisma} , info) {
    const {email,password} = args.data;

    const hashedPassword = await hashPassword(password);
    const emailTaken = await prisma.exists.User({email});
    
    if(emailTaken) {
      throw new Error(`Email ${email} is already in use.`);
    }

    const user =  await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword
      }
    });

    return {
      user,
      token: generateToken(user.id)
    }

  },

  async deleteUser(parent, args, {prisma, request}, info) {
    const userId = getUserId(request);

    return await prisma.mutation.deleteUser(
      {
        where: {
          id: userId
        }
      } , info);
  },

  async updateUser(parent, args, {prisma , request}, info) {
    const userId = getUserId(request);
    const {data} = args;

    if(typeof args.data.password === 'string'){
      args.data.password = await hashPassword(data.password);
    }

    return await prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data
    },info);
  }
}

export {Mutation as default};