import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import {CommonModule, NgOptimizedImage} from '@angular/common'

import { FriendRequest } from './pages/page-components/friend-request/friend-request.component'
import { ChangeEmailStep2 } from './dialogs/change-email/change-email-step2/change-email-step2.component'
import { Device } from './pages/page-components/device/device.component'
import { MyFriends } from './pages/my-friends/my-friends.component'
import { EditBirthday } from './dialogs/edit-birthday/edit-birthday.component'
import { Subscription } from './pages/page-components/subscription/subscription.component'
import { ChangeEmailStep3 } from './dialogs/change-email/change-email-step3/change-email-step3.component'
import { ChangeEmailStep1 } from './dialogs/change-email/change-email-step1/change-email-step1.component'
import { Devices } from './pages/devices/devices.component'
import { AddPaymentMethod } from './dialogs/add-card/add-payment-method/add-payment-method.component'
import { WhatsNew } from './dialogs/whatsnew/whats-new/whats-new.component'
import { Friend } from './pages/page-components/friend/friend.component'
import { AuthorizedAppPermission } from './pages/page-components/authorized-app-permission/authorized-app-permission.component'
import { Transaction } from './pages/page-components/transaction/transaction.component'
import { EnterPassword } from './dialogs/enter-password/enter-password.component'
import { Profile } from './pages/profile/profile.component'
import { Security } from './pages/security/security.component'
import { Privacy } from "./pages/privacy/privacy.component";
import { ConnectedApps } from './pages/connected-apps/connected-apps.component'
import { PermissionCategory } from './pages/page-components/permission-category/permission-category.component'
import { RegistrationStart } from './pages/registration/registration-start/registration-start.component'
import { RegistrationName } from './pages/registration/registration-name/registration-name.component'
import { AddCardAddress } from './dialogs/add-card/add-card-address/add-card-address.component'
import { AddPaypal } from './dialogs/add-card/add-paypal/add-paypal.component'
import { RegistrationProfile } from './pages/registration/registration-profile/registration-profile.component'
import { RegistrationSecurity } from './pages/registration/registration-security/registration-security.component'
import { AuthorizedApps } from './pages/authorized-apps/authorized-apps.component'
import { WhatsNewCategory } from './dialogs/whatsnew/whats-new-category/whats-new-category.component'
import { ConfirmationDialog } from './dialogs/confirmation-dialog/confirmation-dialog.component'
import { Gifts } from './pages/gifts/gifts.component'
import { ProfileModal } from './pages/page-components/profile-modal/profile-modal.component'
import { MyID } from './pages/my-id/my-id.component'
import { ConnectedApp } from './pages/page-components/connected-app/connected-app.component'
import { SetupTOTP } from './dialogs/setup-totp/setup-totp.component'
import { EditUsername } from './dialogs/edit-username/edit-username.component'
import { AuthorizedApp } from './pages/page-components/authorized-app/authorized-app.component'
import { AddFriend } from './pages/add-friend/add-friend.component'
import { Billing } from './pages/billing/billing.component'
import { AddCard } from './dialogs/add-card/add-card/add-card.component'
import { OAuth2PermissionBox } from './pages/page-components/oauth2permission-box/oauth2permission-box.component'
import { SecurityKey } from './pages/page-components/security-key/security-key.component'
import { ConnectionButton } from './pages/page-components/connection-button/connection-button.component'
import { NameSecurityKey } from './dialogs/name-security-key/name-security-key.component'
import { PaymentMethod } from './pages/page-components/payment-method/payment-method.component'
import { Subscriptions } from './pages/subscriptions/subscriptions.component'
import { LoadingStrikeComponent } from './loading-strike/loading-strike.component'
import {EditName} from "./dialogs/edit-name/edit-name.component";
import {GooeyCheckboxComponent} from "./gooey-checkbox/gooey-checkbox.component";
import {WulfcoSnackbar} from "./snackbar/wulfco-snackbar.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Blocked} from "./pages/blocked/blocked.component";
import {Block} from "@angular/compiler";

@NgModule({
  declarations: [
    FriendRequest,
    ChangeEmailStep2,
    Device,
    MyFriends,
    Privacy,
    EditBirthday,
    Subscription,
    ChangeEmailStep3,
    ChangeEmailStep1,
    Devices,
    AddPaymentMethod,
    WhatsNew,
    Friend,
    AuthorizedAppPermission,
    Transaction,
    EnterPassword,
    Profile,
    Security,
    ConnectedApps,
    PermissionCategory,
    RegistrationProfile,
    RegistrationStart,
    AddCardAddress,
    AddPaypal,
    RegistrationName,
    RegistrationSecurity,
    AuthorizedApps,
    WhatsNewCategory,
    ConfirmationDialog,
    Gifts,
    ProfileModal,
    MyID,
    ConnectedApp,
    SetupTOTP,
    EditUsername,
    AuthorizedApp, AddFriend,
    Billing,
    AddCard,
    OAuth2PermissionBox,
    SecurityKey,
    ConnectionButton,
    NameSecurityKey,
    PaymentMethod,
    Subscriptions,
    LoadingStrikeComponent,
    EditName,
    GooeyCheckboxComponent,
    WulfcoSnackbar,
      Blocked
  ],
    imports: [CommonModule, RouterModule, NgOptimizedImage, FormsModule, ReactiveFormsModule],
    exports: [
        FriendRequest,
        ChangeEmailStep2,
        Device,
        MyFriends,
        EditBirthday,
        Subscription,
        ChangeEmailStep3,
        ChangeEmailStep1,
        Devices,
        AddPaymentMethod,
        WhatsNew,
        Friend,
        AuthorizedAppPermission,
        Transaction,
        EnterPassword,
        Profile,
        Security,
        ConnectedApps,
        RegistrationName,
        RegistrationSecurity,
        RegistrationProfile,
        PermissionCategory,
        RegistrationStart,
        AddCardAddress,
        AddPaypal,
        AuthorizedApps,
        WhatsNewCategory,
        ConfirmationDialog,
        Gifts,
        ProfileModal,
        MyID,
        ConnectedApp,
        SetupTOTP,
        EditUsername,
        AuthorizedApp,
        AddFriend,
        Billing,
        AddCard,
        OAuth2PermissionBox,
        SecurityKey,
        ConnectionButton,
        NameSecurityKey,
        PaymentMethod,
        Subscriptions,
        LoadingStrikeComponent,
        EditName,
        GooeyCheckboxComponent,
        WulfcoSnackbar,
        Privacy,
        Blocked
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
