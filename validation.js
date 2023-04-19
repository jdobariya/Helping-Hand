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
  isValid(arr[i])
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
    return r.test(contact);
}
export function validatePassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{}|\\,.?'";:/<>\-])\S{8,}$/;
  return regex.test(password);
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