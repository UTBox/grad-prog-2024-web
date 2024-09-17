start:
	docker build -t "leave-management-app" .
	docker run -p 4200:4200 leave-management-app
