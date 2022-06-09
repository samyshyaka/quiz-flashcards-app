import { booleanArg, extendType, intArg, nonNull, objectType, stringArg } from "nexus";

export const Card = objectType({
    name: "Card",
    definition(t) {
        t.nonNull.int("cardId");
        t.nonNull.string("category");
        t.nonNull.string("question");
        t.nonNull.string("answer");
        t.field("postedBy", {
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.card
                    .findUnique({
                        where: {
                            cardId: parent.cardId
                        }
                    })
                    .postedBy();
            }
        });
        t.nonNull.boolean("isDone"); 
    },
});

export const CardQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type: "Card",
            args: {
                category: stringArg(),
            },
            resolve(parent, args, context, info) {
                return context.prisma.card.findMany({
                    where: args.category ? {
                        OR: [
                            { category: { contains: args.category } }
                        ]
                    }
                    : {},
                });
            },
        });

        t.nonNull.list.nonNull.field("getDoneCards", {
            type: "Card",
            args: {
                isDone: booleanArg(),
            },
            resolve(parent, args, context, info) {
                return context.prisma.card.findMany({
                    where: {
                        isDone: true,
                    }
                })
            }
        })
        
        t.field("feedById", {
            type: "Card",
            args: {
                cardId: nonNull(intArg()),
            },
            resolve(parent, args, context, info) {
                const { cardId } = args
                return context.prisma.card.findUnique({
                    where: {
                        cardId,
                    }
                })
            },
        });
    },
});

export const CardMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Card",
            args: {
                category: nonNull(stringArg()),
                question: nonNull(stringArg()),
                answer: nonNull(stringArg()),
            },
            resolve(parent, args, context){
                const { category, question, answer } = args;
                const { userId } = context;

                if (!userId) {
                    throw new Error("You need to login first")
                }

                const newCard = context.prisma.card.create({
                    data: {
                        category,
                        question,
                        answer,
                        postedBy: { connect: { id: userId } },
                    },
                });

                return newCard;
            }
        });
        t.nonNull.field("update", {
            type: "Card",
            args: {
                cardId: nonNull(intArg()),
                category: nonNull(stringArg()),
                question: nonNull(stringArg()),
                answer: nonNull(stringArg()),
            },
            resolve(parent, args, context){
                const { cardId, category, question, answer } = args;
                const { userId } = context;

                if (!userId) {
                    throw new Error("You need to login first")
                }
                const updatedUser = context.prisma.card.update({
                    where: {
                        cardId
                    },
                    data: {
                        category,
                        question,
                        answer,
                    }
                })
                return updatedUser;
            }
        })
        t.nonNull.field("markAsDone", {
            type: "Card",
            args: {
                cardId: nonNull(intArg())
            },
            resolve(parent, args, context, info) {
                const { cardId } = args;
                return context.prisma.card.update({
                    where: {
                        cardId,
                    },
                    data: {
                        isDone: true,
                    }
                })
            }
        })
        t.nonNull.field("delete", {
            type: "Card",
            args: {
                cardId: nonNull(intArg())
            },
            resolve(parent, args, context){
                const { cardId } = args;
                const { userId } = context;

                if (!userId) {
                    throw new Error("You need to login first")
                }

                return context.prisma.card.delete({
                    where: {
                        cardId,
                    }
                })
            }
        })
    }
})
