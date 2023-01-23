package client

import (
	"context"
	"google.golang.org/grpc"
	"grpcclient/pkg/pb/apipb/pb"
)

type Client struct {
	conn   *grpc.ClientConn
	client pb.HeroServiceClient
}

func NewClient() *Client {
	conn, err := grpc.Dial("localhost:5001", grpc.WithInsecure())
	if err != nil {
		panic("failed to connect the gRPC client of typescript")
	}
	return &Client{
		conn:   conn,
		client: pb.NewHeroServiceClient(conn),
	}
}

func (c *Client) FindOne(id int32) (*pb.Hero, error) {
	req := &pb.HeroById{Id: id}

	return c.client.FindOne(newCtx(), req)
}

func newCtx() context.Context {
	return context.Background()
}
