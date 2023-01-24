package main

import (
	"fmt"
	cl "grpcclient/pkg/client"
)

func main() {
	cl := cl.NewClient()
	if cl != nil {
		fmt.Printf("Connection is successful\n")
	}
	var i int32
	for i = 0; i<3; i++ {
	data, err := cl.FindOne(i+1)
	if err != nil {
		fmt.Printf("failed to get result")
	} else {
		fmt.Printf(" data: %+v\n", data)
	}
	}
}
