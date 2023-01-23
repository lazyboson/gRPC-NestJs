package main

import (
	"fmt"
	cl "grpcclient/pkg/client"
)

func main() {
	cl := cl.NewClient()
	if cl != nil {
		fmt.Printf("Connection is successful")
	}

	data, err := cl.FindOne(2)
	if err != nil {
		fmt.Printf("failed to get result")
	} else {
		fmt.Printf(" data: %+v", data)
	}
}
