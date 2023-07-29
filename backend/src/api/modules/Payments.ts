import Stripe from 'stripe';
import User from "./User";
import * as database from "../FirebaseHandler"
import mail from "@sendgrid/mail";

mail.setApiKey(`${process.env.SENDGRID_API_KEY}`)

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

    public static async verifyIdentity(req: any) {
        const user = await User.get(req)
        if (!user.success) { return user }

        if (user.user.account.identity_verification && user.user.account.identity_verification.status === "verified") { return {status: 400, success: false, message: "You are already verified"} }
        if (user.user.account.identity_verification && user.user.account.identity_verification.attempt >= 3) {
            await database.updateUser(user.rawUser.id, { [`account.identity_verification`]: {
                status: "rejected", reason: "too_many_attempts"
            }})

            await mail.send({
                to: user.user.email, from: "no-reply@wulfco.xyz", subject: "Your identity verification was rejected",
                text: `Hello @${user.user.profile.username},\n\nYour identity verification was rejected because you have tried too many times. Please contact support if you believe this is a mistake, or would like to appeal this decision.\n\nBest regards,\nYour Wulfco team`
            })

            return {status: 400, success: false, message: "Too many attempts"}
        }

        const session = await stripe.identity.verificationSessions.create({
            type: 'document',
            metadata: {user_id: user.rawUser.id,}
        })

        await database.updateUser(user.rawUser.id, { [`account.identity_verification`]: {
            status: "pending"
        }})

        return {status: 200, success: true, url: session.url}
    }

    public static async stripeEvents(req: any) {
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WHSEC);
        } catch (err) {
            return {status: 400, success: false, message: `Webhook Error: ${err.message}`};
        }

        // Handle the event
        switch (event.type) {
            case 'charge.failed':
                const chargeFailed = event.data.object;
                // Then define and call a function to handle the event charge.failed
                break;
            case 'charge.refunded':
                const chargeRefunded = event.data.object;
                // Then define and call a function to handle the event charge.refunded
                break;
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object;
                // Then define and call a function to handle the event charge.succeeded
                break;
            case 'customer.deleted':
                const customerDeleted = event.data.object;
                // Then define and call a function to handle the event customer.deleted
                break;
            case 'identity.verification_session.requires_input':
                const identityVerificationSessionRequiresInput = event.data.object;
                const identityVerificationSessionRequiresInputUser = await database.getUser(identityVerificationSessionRequiresInput.metadata.user_id)

                await database.updateUser(identityVerificationSessionRequiresInput.metadata.user_id, { [`account.identity_verification`]: {
                    status: "rejected", reason: identityVerificationSessionRequiresInput.last_error.code, verification_id: identityVerificationSessionRequiresInput.id, attempt: identityVerificationSessionRequiresInputUser.data().account.identity_verification.attempt ? identityVerificationSessionRequiresInputUser.data().account.identity_verification.attempt + 1 : 1
                }})

                switch (identityVerificationSessionRequiresInput.last_error.code) {
                    case 'document_unverified_other': {
                        await mail.send({
                            to: identityVerificationSessionRequiresInputUser.data().email, from: "alerts@wulfco.xyz", subject: "Your identity verification was rejected",
                            text: `Hello @${identityVerificationSessionRequiresInputUser.data().profile.username},\n\nYour identity verification was rejected because your document was invalid. Please try again with a valid document.\n\nBest regards,\nYour Wulfco team`
                        })
                        break;
                    }
                    case 'document_expired': {
                        await mail.send({
                            to: identityVerificationSessionRequiresInputUser.data().email, from: "alerts@wulfco.xyz", subject: "Your identity verification was rejected",
                            text: `Hello @${identityVerificationSessionRequiresInputUser.data().profile.username},\n\nYour identity verification was rejected because your document was expired. Please try again with a valid document.\n\nBest regards,\nYour Wulfco team`
                        })
                        break;
                    }
                    case 'document_type_not_supported': {
                        await mail.send({
                            to: identityVerificationSessionRequiresInputUser.data().email, from: "alerts@wulfco.xyz", subject: "Your identity verification was rejected",
                            text: `Hello @${identityVerificationSessionRequiresInputUser.data().profile.username},\n\nYour identity verification was rejected because your document type is not supported. Please try again with a valid document.\n\nBest regards,\nYour Wulfco team`
                        })
                        break;
                    }
                    default: {
                        await mail.send({
                            to: identityVerificationSessionRequiresInputUser.data().email, from: "alerts@wulfco.xyz", subject: "Your identity verification was rejected",
                            text: `Hello @${identityVerificationSessionRequiresInputUser.data().profile.username},\n\nYour identity verification was rejected for an unknown reason. Please try again.\n\nBest regards,\nYour Wulfco team`
                        })
                    }
                }

                break;
            case 'identity.verification_session.verified':
                const identityVerificationSessionVerified = event.data.object;
                const identityVerificationSessionVerifiedUser = await database.getUser(identityVerificationSessionVerified.metadata.user_id)

                await stripe.identity.verificationReports.list({verification_session: identityVerificationSessionVerified.id}).then(async (report) => {
                    const reportId = report.data[0].id;
                    const reportData = await stripe.identity.verificationReports.retrieve(reportId);
                    const name = reportData.document.first_name + " " + reportData.document.last_name;
                    const dob = reportData.document.dob ? reportData.document.dob : "Unknown"
                    const documentType = reportData.document.type;
                    const documentCountry = reportData.document.issuing_country;
                    const documentNumber = reportData.document.number;
                    const documentExpirationDate = reportData.document.expiration_date ? reportData.document.expiration_date : "Unknown"

                    await database.updateUser(identityVerificationSessionVerifiedUser.id,  { [`account.identity_verification`]: {
                        status: "verified", verification_id: identityVerificationSessionVerified.id, attempt: identityVerificationSessionVerifiedUser.data().account.identity_verification.attempt ? identityVerificationSessionVerifiedUser.data().account.identity_verification.attempt + 1 : 1,
                        information: {name: name ? name : "Unknown", dob: dob ? dob : "Unknown", documentType: documentType ? documentType : "Unknown", documentCountry: documentCountry ? documentCountry : "Unknown", documentNumber: documentNumber ? documentNumber : "Unknown", documentExpirationDate: documentExpirationDate ? documentExpirationDate : "Unknown"}
                    }});

                    await mail.send({
                        to: identityVerificationSessionVerifiedUser.data().email, from: "alerts@wulfco.xyz", subject: "Your identity verification was approved",
                        text: `Hello @${identityVerificationSessionVerifiedUser.data().profile.username},\n\nYour identity verification was approved, thanks.\n\nBest regards,\nYour Wulfco team`
                    })
                }).catch(async (err) => {
                    await mail.send({
                        to: identityVerificationSessionVerifiedUser.data().email,
                        from: "alerts@wulfco.xyz",
                        subject: "We ran into an error whilst verifying your identity",
                        text: `Hello @${identityVerificationSessionVerifiedUser.data().profile.username},\n\nWe ran into an error whilst verifying your identity. Please try again.\n\nBest regards,\nYour Wulfco team`
                    })
                })

                break;
            case 'identity.verification_session.redacted':
                const identityVerificationSessionRedacted = event.data.object;
                const identityVerificationSessionRedactedUser = await database.getUser(identityVerificationSessionRedacted.metadata.user_id)
                await database.updateUser(identityVerificationSessionRedacted.metadata.user_id,  { [`account.identity_verification`]: {
                    status: "rejected", reason: "redacted", verification_id: identityVerificationSessionRedacted.id, attempt: identityVerificationSessionRedactedUser.data().account.identity_verification.attempt ? identityVerificationSessionRedactedUser.data().account.identity_verification.attempt : 1
                }});
                await mail.send({
                    to: identityVerificationSessionRedactedUser.data().email, from: "alerts@wulfco.xyz", subject: "Your identity verification was redacted",
                    text: `Hello @${identityVerificationSessionRedactedUser.data().profile.username},\n\nYour identity verification was redacted. If you believe this was a mistake, please contact us at support@wulfco.xyz.\n\nBest regards,\nYour Wulfco team`
                })
                break;
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                // Then define and call a function to handle the event payment_intent.succeeded
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        return {status: 200, success: true, received: true}
    }
}