import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../../src/prisma';

//Seed users
const userOne = {
  input: {
    name: 'Jen',
    email: 'jen@example.com',
    password: bcrypt.hashSync('qweqweqwe')
  },
  user: undefined,
  jwt: undefined
};

const userTwo = {
  input: {
    name: 'Kevin',
    email: 'kevin@example.com',
    password: bcrypt.hashSync('qweqweqwe')
  },
  user: undefined,
  jwt: undefined
};







const seedDatabase = async () => {
  // Delete test data
  await prisma.mutation.deleteManyUsers();

  //Create userOne
  userOne.user = await prisma.mutation.createUser({
    data: {
      ...userOne.input
    }
  });
  const userId = userOne.user.id;
  userOne.jwt = jwt.sign({userId}, process.env.JWT_SECRET);

  //Create userTwo
  userTwo.user = await prisma.mutation.createUser({
    data: {
      ...userTwo.input
    }
  });
  const userTwoId = userTwo.user.id;
  userTwo.jwt = jwt.sign({userId: userTwoId}, process.env.JWT_SECRET);
};


export {seedDatabase as default, userOne, userTwo};