 Actions:
 Any time data is manipulated, it goes here.

 the only functions that should remain in the components are handle click functions, 
    which will dispatch the actions.



actions that dont update state, but are saving data to the database, these are sagas.
sagas handle asynchronous calls that dont manipulate state

potentially dont need those



update logged in user(grab profile/name, set state)

save profile to DB on creation(also set it to state)

add trip(save to current trips array in state)

select trip(update selected trip state)

select connection (set connectipn user/profile to state)




