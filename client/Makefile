create:
	protoc --proto_path=pkg/pb/proto pkg/pb/proto/*.proto --go_out=pkg/pb/apipb/
	protoc --proto_path=pkg/pb/proto pkg/pb/proto/*.proto --go-grpc_out=pkg/pb/apipb/

clean:
	rm pb/apipb/*.go