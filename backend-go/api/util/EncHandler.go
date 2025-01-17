package util

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"io"
)

func EncryptData(data string, encdecKey string) (string, error) {
	cipherBlock, err := aes.NewCipher([]byte(encdecKey))
	if err != nil {
		return "", err
	}

	encryptedData := make([]byte, aes.BlockSize+len(data))

	iv := encryptedData[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	encryptStream := cipher.NewCTR(cipherBlock, iv)
	encryptStream.XORKeyStream(encryptedData[aes.BlockSize:], []byte(data))

	base64EncryptedData := base64.StdEncoding.EncodeToString(encryptedData)

	return base64EncryptedData, nil
}

func DecryptData(rawEncryptedData string, encdecKey string) (any, error) {
	encryptedData, err := base64.StdEncoding.DecodeString(rawEncryptedData)
	if err != nil {
		return "", err
	}

	cipherBlock, err := aes.NewCipher([]byte(encdecKey))
	if err != nil {
		return "", err
	}

	if len(encryptedData) < aes.BlockSize {
		return "", errors.New("encrypted data block size is too short")
	}

	iv := encryptedData[:aes.BlockSize]
	encryptedData = encryptedData[aes.BlockSize:]

	decryptStream := cipher.NewCTR(cipherBlock, iv)
	decryptStream.XORKeyStream(encryptedData, encryptedData)

	return encryptedData, nil
}

func GenerateEncdecKey() ([]byte, error) {
	key := make([]byte, 32)
	_, err := rand.Read(key)
	if err != nil {
		return nil, err
	}
	return key, nil
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func ComparePasswords(hashedPassword, password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)) == nil
}
