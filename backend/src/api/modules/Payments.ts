import Stripe from 'stripe';
import User from "./User";
import * as database from "../FirebaseHandler"

const stripe = new Stripe(`${process.env.STRIPE_SECRET}`, {
    apiVersion: '2022-11-15'
});

export default class Payments {
    public static async addCard(req: any) {
        const user = await User.get(req)
        if (!user.success) { return user }
        if (user.user === undefined) { return {status: 400, success: false, message: "Could not find user"} }

        const card = req.body.card
        if (!card) { return {status: 400, success: false, message: "Missing fields"} }
        const address = req.body.address
        if (!address) { return {status: 400, success: false, message: "Missing fields"} }

        let stripeCustomer;
        if (user.user.account.billing && user.user.account.billing.customer_id) {
            stripeCustomer = await stripe.customers.retrieve(user.user.account.billing.customer_id);
        } else {
            stripeCustomer = await stripe.customers.create({
                name: user.user.profile.full_name,
                email: user.user.email,
                metadata: { user_id: user.rawUser.id },
            });
            await database.updateUser(user.rawUser.id, { [`account.billing.customer_id`]: stripeCustomer.id });
        }

        const cardholder = address.cardholder_name
        delete address.cardholder_name

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {token: card},
            billing_details: {
                name: cardholder,
                address: address,
            },
        });

        await stripe.paymentMethods.attach(paymentMethod.id, {customer: stripeCustomer.id});

        return {status: 200, success: true}
    }

    public static async getCards(user: any) {
        const stripeCustomer = await stripe.customers.retrieve(user.account.billing.customer_id);
        const paymentMethods = await stripe.paymentMethods.list({
            customer: stripeCustomer.id,
            type: 'card',
        });

        return {status: 200, success: true, cards: paymentMethods.data}
    }

    public static async getTransactions(user: any) {
        const stripeCustomer = await stripe.customers.retrieve(user.account.billing.customer_id);
        const transactions = await stripe.charges.list({
            customer: stripeCustomer.id,
            limit: 100,
        });

        return {status: 200, success: true, transactions: transactions.data}
    }
}