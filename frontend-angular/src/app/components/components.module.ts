import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { FriendRequest } from './friend-request/friend-request.component'
import { ChangeEmailStep2 } from './change-email-step2/change-email-step2.component'
import { Device } from './device/device.component'
import { MyFriends } from './my-friends/my-friends.component'
import { EditBirthday } from './edit-birthday/edit-birthday.component'
import { Subscription } from './subscription/subscription.component'
import { ChangeEmailStep3 } from './change-email-step3/change-email-step3.component'
import { ChangeEmailStep1 } from './change-email-step1/change-email-step1.component'
import { Devices } from './devices/devices.component'
import { AddPaymentMethod } from './add-payment-method/add-payment-method.component'
import { WhatsNew } from './whats-new/whats-new.component'
import { Friend } from './friend/friend.component'
import { AuthorizedAppPermission } from './authorized-app-permission/authorized-app-permission.component'
import { Transaction } from './transaction/transaction.component'
import { EnterPassword } from './enter-password/enter-password.component'
import { Profile } from './profile/profile.component'
import { Security } from './security/security.component'
import { ConnectedApps } from './connected-apps/connected-apps.component'
import { PermissionCategory } from './permission-category/permission-category.component'
import { RegistrationFinish } from './registration-finish/registration-finish.component'
import { RegistrationStart } from './registration-start/registration-start.component'
import { AddCardAddress } from './add-card-address/add-card-address.component'
import { AddPaypal } from './add-paypal/add-paypal.component'
import { RegistrationNext } from './registration-next/registration-next.component'
import { AuthorizedApps } from './authorized-apps/authorized-apps.component'
import { WhatsNewCategory } from './whats-new-category/whats-new-category.component'
import { ConfirmationDialog } from './confirmation-dialog/confirmation-dialog.component'
import { Gifts } from './gifts/gifts.component'
import { ProfileModal } from './profile-modal/profile-modal.component'
import { MyID } from './my-id/my-id.component'
import { ConnectedApp } from './connected-app/connected-app.component'
import { SetupTOTP } from './setup-totp/setup-totp.component'
import { EditUsername } from './edit-username/edit-username.component'
import { AuthorizedApp } from './authorized-app/authorized-app.component'
import { AddAFriend } from './add-afriend/add-afriend.component'
import { Billing } from './billing/billing.component'
import { AddCard } from './add-card/add-card.component'
import { OAuth2PermissionBox } from './oauth2permission-box/oauth2permission-box.component'
import { SecurityKey } from './security-key/security-key.component'
import { ConnectionButton } from './connection-button/connection-button.component'
import { NameSecurityKey } from './name-security-key/name-security-key.component'
import { PaymentMethod } from './payment-method/payment-method.component'
import { Subscriptions } from './subscriptions/subscriptions.component'

@NgModule({
  declarations: [
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
    PermissionCategory,
    RegistrationFinish,
    RegistrationStart,
    AddCardAddress,
    AddPaypal,
    RegistrationNext,
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
    AddAFriend,
    Billing,
    AddCard,
    OAuth2PermissionBox,
    SecurityKey,
    ConnectionButton,
    NameSecurityKey,
    PaymentMethod,
    Subscriptions,
  ],
  imports: [CommonModule, RouterModule],
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
    PermissionCategory,
    RegistrationFinish,
    RegistrationStart,
    AddCardAddress,
    AddPaypal,
    RegistrationNext,
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
    AddAFriend,
    Billing,
    AddCard,
    OAuth2PermissionBox,
    SecurityKey,
    ConnectionButton,
    NameSecurityKey,
    PaymentMethod,
    Subscriptions,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
