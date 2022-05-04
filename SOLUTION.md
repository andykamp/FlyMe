## Solution nd appproach

Possible approaches: 
- server side rendering. Requests are polled and cached every 3 (and 24) minutes and cached. Then delivered to clients with no 'compute' latency on the server. 
- set up own server that polls and cached the data in e.g redis. Then clients query this server instead. Less time to compute + less reuest to the actual server that is stated to ot want that
- client side ad-hoc queries per aiport. longer time per fetch of switch. can be combated by caching all reequests and only fetching the new ones that is not fetches or is out of data.   time for this on e.g oslo i
- fetch all data every 3 minutes. longer initial time, more memory that is unused, more queries to server. super fast user experience after initial load. 

- to i need to offload requests and parsing to webworker? o parsing takes 5-10 ms and so it maght be more costly to serialize it between the treads than to actualy do the parsing in the main tread. :w

- can i use  caching?
- could check if there is any feparting flights to a aiport in the original request, and then only query  d/a from an airport


- alternatives with caching becomes a shared vsprvate chaching solution


test?:
- nope. to little time. would be nice tho 

Planning
- jira roadmap
- figma design 

Implementation
- small commits
- squash commits
- storybook?
- webworkers?
- compression?
- memo , use-callback, and rendering optimization?
- kepler.gl for viz?
- use performance now to get result on perforamnce. also thing about time complexity.


edge cases:
- api returns difrent on 0, 1, and 2+ flights
- do i need to take via-flights into account
- use lastupdate to reduct the payload and change
- can one use private caching with cors and without adding it to the server?



NOTES:
- to inconsisten with typescript () and ({}) inputs. Need to find the flow with typescript
- takes some shortcuts with type 'any' when it gets complicated
- incosistent with type/interface naming
- mapping airplanes and statuscodes indifferently was suboptimal because it is needed in the flightApi funciton 
- not immutable data atm
