package firebase

import (
	"context"
	firebase "firebase.google.com/go"
	"fmt"
	"google.golang.org/api/option"
)

var firebaseApp *firebase.App

func Initialise() {
	opt := option.WithCredentialsFile("api/serviceAccountKey.json")
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		panic(err)
	}

	firebaseApp = app
}

func GetUser(userId string) (map[string]interface{}, error) {
	firestore, err1 := firebaseApp.Firestore(context.Background())
	if err1 != nil {
		return nil, fmt.Errorf("failed to get Firestore client: %w", err1)
	}
	defer firestore.Close()

	document, err2 := firestore.Collection("users").Doc(userId).Get(context.Background())
	if err2 != nil {
		return nil, fmt.Errorf("failed to get user document: %w", err2)
	}

	documentData := document.Data()
	if documentData == nil {
		return nil, fmt.Errorf("failed to get user document data")
	}

	return documentData, nil
}
