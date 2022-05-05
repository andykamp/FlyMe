# Approach and solution 

## Possible approaches: 
- server side rendering. Requests are polled and cached every 3 (and 24) minutes and cached. Then delivered to clients with no 'compute' latency on the server. 
- set up own server that polls and cached the data in e.g redis. Then clients query this server instead. Less time to compute + less reuest to the actual server that is stated to ot want that
- client side ad-hoc queries per aiport. longer time per fetch of switch. can be combated by caching all reequests and only fetching the new ones that is not fetches or is out of data.   time for this on e.g oslo i
- fetch all data every 3 minutes. longer initial time, more memory that is unused, more queries to server. super fast user experience after initial load. 


### Interesting questions to answer
- webworkers?
    - Might be nice, but as payload is small the parsing/formatting time might very well be equal to the copy operation between the treads. 
- shared vs local cache?
    - Depends on the approach (ssr or client-side). Would prefer not to add custom cache logic. Fetch API and XHR has build in cachw with ttl. 
- test?
    - No. Always nice but not on this small project 



### Some possible edge cases:
- the API returns different formats based on if a airport has 0, 1, or  2+ flights
- some flights might not match


### Other notes about the implementation:
- to inconsisten with typescript () and ({}) inputs. Need to find the flow with typescript
- takes some shortcuts with type 'any' when it gets complicated
- incosistent with type/interface naming
- mapping airplanes and statuscodes indifferently was suboptimal because it is needed in the flightApi funciton 
- not immutable data atm
- not working on mobile (not reponsive)
- not using updaet_ley to minimize the paylaod
