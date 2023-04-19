import {ObjectId} from 'mongodb';

export function isValidString(str)
{
    
    if(!str)
    {
        throw "Error: Value can't be empty"
    }
    if(typeof str!=='string')
    {
        throw "Error: Type should be string"
    }
    str=str.trim()
    if(str.length==0)
    {
        throw "Error: inputs can't be empty"
    }
    return str

}
export const isValidArray=(arr,arname)=>
{
if(!Array.isArray(arr))
{
  throw `Error: ${arname} should be an array`
}
if(arr.length==0)
{
  throw `Error: ${arname} list can't be empty`
}
for(let i=0;i<arr.length;i++)
{
  isValidString(arr[i])
  arr[i]=arr[i].trim()
}
return arr
}

export function isValidId(id)
{
  if (!id)
  {
    throw 'Error: Valid Id must be provided';
  } 
  if (typeof id !== 'string') throw 'Error: Id must be a string';
  if (id.trim().length === 0)
    throw 'Error: Id cannot be empty or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
}

export function isValidContact(contact)
{
    const r = /^\d{10}$/;
    let res= r.test(contact)
    if(res)
    {
      return contact.trim()
    }
    throw "Error: Contact number should be exactly 10 characters"
}
export function validatePassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\,.?'";:/<>\-])\S{8,}$/;
  if(regex.test(password)){
    return password.trim()
  }
  throw "Error: Password should match the requirements[atleast 8 characters consisting atleast( 1 upper case, 1 number, 1 special character, 1 lower case)"
}
export function isUserAdult(d) {
  let dob = new Date(d);
  let now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  if (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate())) {
    age--;
  }
  return age >= 18;
}


export function isValidEmail(email) {
  const r = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(r.test(email))
  {
    return true
  }
  throw "Error: invalid email"
}

export function checkInputs(
  first_name,
    last_name,
    contact,
    email,
    bio = "",
    skills = [],
    address = "",
    past_events = [],
    current_events=[],
    past_hosted_events=[],
    current_hosted_events=[],
    user_story=[],
    user_feedback=[]
)
{
  first_name=isValidString(first_name)
    last_name=isValidString(last_name)
    contact=isValidContact(contact)
    email=email.trim().toLowerCase()

    isValidEmail(email)
    bio=bio.trim()
    if(skills.length)
    {
        skills=isValidArray(skills)
    }
    address=address.trim()
    if(past_events.length)
    {
        past_events=isValidArray(past_events)
    }
    if(current_events.length)
    {
        current_events=isValidArray(current_events)
    }
    if(past_hosted_events.length)
    {
        past_hosted_events=isValidArray(past_hosted_events)
    }
    if(current_hosted_events.length)
    {
        current_hosted_events=isValidArray(current_hosted_events)
    }
    if(user_story.length)
    {
        user_story=isValidArray(user_story)
    }
    if(user_feedback.length)
    {
      user_feedback=isValidArray(user_feedback)
    }
    return {first_name,
    last_name,
    contact,
    email,
    bio,
    skills ,
    address,
    past_events,
    current_events,
    past_hosted_events,
    current_hosted_events,
    user_story,
  user_feedback}

}