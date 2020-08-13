Test urls

examples 

http://localhost:3200/api/topEpisodes/1?showid=2


http://localhost:3200/api/topEpisodes/1?showid=1400

popularSeries- top 5 series
http://localhost:3200/api/analytics/popularSeries


To test this code in docker need to run this command

docker run -p 3200:3200 -e github='https://github.com/crajbanshi/tmdbtest.git' -it  oktaadmin/dockertest  

This command will deploy code from github using port number 3200

if not dep
