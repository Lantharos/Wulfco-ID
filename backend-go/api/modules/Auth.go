package modules

import (
	"backend-go/api/util"
	"backend-go/api/util/firebase"
	"encoding/json"
	"net/http"
)

func Login(r *http.Request) map[string]interface{} {
	var body struct {
		Email    string `json:"email,omitempty" bson:"email,omitempty"`
		Password string `json:"password,omitempty" bson:"password,omitempty"`
		HCaptcha string `json:"h-captcha,omitempty" bson:"h-captcha,omitempty"`
	}

	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		return map[string]interface{}{
			"status":  "error",
			"message": "Failed to decode request body",
			"code":    "400",
		}
	}

	user, _ := firebase.GetUser("AvEf1P75Qbb60ds5mWbC")
	encdecKey, _ := util.GenerateEncdecKey()
	marshalledUser, _ := json.Marshal(user)
	encryptedData, _ := util.EncryptData(string(marshalledUser), string(encdecKey))

	return map[string]interface{}{
		"status":  "success",
		"message": "Login successful",
		"code":    "200",
		"user":    encryptedData,
	}
}
