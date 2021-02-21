# Local Development

You can run the back-end server in a docker container by building and running the Dockerfile here.

1. First, you need to create `config` and `credentials` files in the dev/config/aws/ directory based on their .dist file templates.

2. Create a symlink for the node_modules directory. This keeps them inside the container and improves performance.
`ln -s /tmp/node_modules`

3. Build the docker image
`docker build dev -t lam-usr-svc-img`

4. Start up the app in the local container. Nodemon will restart when it detects file changes.
`docker run -it --rm --name lambdasvc -v `pwd`:/app -p 4001:4001 lam-usr-svc-img`

You can access the server locally now at http://localhost:4001/
Example endpoint: http://localhost:4001/users

* To deploy, run: `docker exec -it lamdasvc sls deploy`

* To get a shell inside the container, run: `docker exec -it lamdasvc bash`
