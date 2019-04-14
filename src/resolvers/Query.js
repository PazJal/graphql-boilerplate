import getUserId from '../utils/getUserId';


const Query = {
  async me(parent, args, {prisma , request} , info) {
    const userId = getUserId(request);
    const user  = await prisma.query.user({
      where: {
        id: userId
      }
    });
    return user;
  },

  users(parent , args , {prisma} , info) {
    const {first , skip, after, orderBy} = args;
    const opArgs = {
      first,
      skip,
      after,
      orderBy
    };
    
    if(args.query){
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          }
        ]
      }
    }

    return prisma.query.users(opArgs, info);
  }
};

export {Query as default};