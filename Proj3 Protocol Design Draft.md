### Data Structure Design: 

Every transmitted websocket packet will need 

- a timestamp
- a "type" string
  - userid
  - username
  - avatar
  - aval_time (or a simple true/false)
  - arrival_status
  - ETA
  - idea_{name, desc(?)}
  - idea_vote
  - idea_chat (will be redirected to the main chat, but with a #idea tag prepended)
- an "action" string
  - add
  - update
  - [pull](https://stackoverflow.com/questions/45241405/should-i-use-web-sockets-to-pull-data-from-server-or-just-a-flag-and-use-that-fl) (socket.io?)
- transmitted data
  - the whole database (cuz we don't have a `pull` yet, nor server-side mechanism)
    - Users will be sending lots of data back and forth (?????)
    - Use "timestamp" and "action" as a filter.
  - userid
  - username
  - profile picture
  - available time (a tuple or an array)
  - message (base64-encoded)