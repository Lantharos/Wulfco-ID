import {Resend} from "resend";

export default async function send(resend: Resend, to: string, token: string){
    return await resend.emails.send({
        to: to,
        from: "no-reply@wulfco.xyz",
        subject: "Verify your email",
        text: "Your email confirmation code is " + token + ". If you didn't request this email, there's nothing to worry about, you can safely ignore it.",
        html: "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
            "<html dir=\"ltr\" lang=\"en\">\n" +
            "\n" +
            "<head>\n" +
            "    <meta content=\"text/html; charset=UTF-8\" http-equiv=\"Content-Type\" />\n" +
            "</head>\n" +
            "<div style=\"display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0\">Confirm your email address<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>\n" +
            "</div>\n" +
            "\n" +
            "<body style=\"background-color:#ffffff;margin:0 auto;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif\">\n" +
            "<table align=\"center\" width=\"100%\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" role=\"presentation\" style=\"max-width:37.5em;margin:0 auto;padding:0px 20px\">\n" +
            "    <tbody>\n" +
            "    <tr style=\"width:100%\">\n" +
            "        <td>\n" +
            "            <table align=\"center\" width=\"100%\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" role=\"presentation\" style=\"margin-top:32px\">\n" +
            "                <tbody>\n" +
            "                <tr>\n" +
            "                    <td><img alt=\"Slack\" height=\"72\" src=\"https://lh3.googleusercontent.com/u/0/drive-viewer/AKGpihbDgfjF7JEiff9xha_K95J4xgQkbuw4FgzlAdSavnizzT4V2gX-XdhLjybrFIaggDT_lynikfsCuvx_g8amDJKeUbSBlw=w1270-h924\" style=\"display:block;outline:none;border:none;text-decoration:none\" width=\"240\" /></td>\n" +
            "                </tr>\n" +
            "                </tbody>\n" +
            "            </table>\n" +
            "            <h1 style=\"color:#1d1c1d;font-size:36px;font-weight:700;margin:30px 0;padding:0;line-height:42px\">Confirm your email address</h1>\n" +
            "            <p style=\"font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px\">Your confirmation code is below - enter it in your open browser window and we&#x27;ll help you get signed in.</p>\n" +
            "            <table align=\"center\" width=\"100%\" border=\"0\" cellPadding=\"0\" cellSpacing=\"0\" role=\"presentation\" style=\"background:rgb(245, 244, 245);border-radius:4px;margin-bottom:30px;padding:40px 10px\">\n" +
            "                <tbody>\n" +
            "                <tr>\n" +
            "                    <td>\n" +
            "                        <p style=\"font-size:30px;line-height:24px;margin:16px 0;text-align:center;vertical-align:middle\">" + token + "</p>\n" +
            "                    </td>\n" +
            "                </tr>\n" +
            "                </tbody>\n" +
            "            </table>\n" +
            "            <p style=\"font-size:14px;line-height:24px;margin:16px 0;color:#000\">If you didn&#x27;t request this email, there&#x27;s nothing to worry about, you can safely ignore it.</p>\n" +
            "        </td>\n" +
            "    </tr>\n" +
            "    </tbody>\n" +
            "</table>\n" +
            "</body>\n" +
            "\n" +
            "</html>"
    })
}