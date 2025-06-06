const { Prisma } = require("../../../generated/prisma")
const bcrypt = require("bcrypt")

module.exports = Prisma.defineExtension({
    name: "HashPassword",
    query: {
        company: {
            create: async ({ args, query }) => {
                try {
                    const hash = await bcrypt.hash(args.data.password, 10)
                    args.data.password = hash
                    return query(args)
                }
                catch (error) {
                    throw error
                }
            }
        },
        worker: {
            create: async ({ args, query }) => {
                try {
                    const hash = await bcrypt.hash(args.data.password, 10)
                    args.data.password = hash
                    return query(args)
                }
                catch (error) {
                    throw error
                }
            }
        }
    }
})