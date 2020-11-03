@echo on
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 701596077896.dkr.ecr.us-east-1.amazonaws.com
cd api
docker build -t rabble-api .
docker tag rabble-api 701596077896.dkr.ecr.us-east-1.amazonaws.com/rabble-api
docker push 701596077896.dkr.ecr.us-east-1.amazonaws.com/rabble-api 
cd ..
cd front-end
docker build -t rabble-frontend .
docker tag rabble-frontend 701596077896.dkr.ecr.us-east-1.amazonaws.com/rabble-frontend 
docker push 701596077896.dkr.ecr.us-east-1.amazonaws.com/rabble-frontend
