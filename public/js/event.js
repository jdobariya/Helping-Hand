const host_time = new Date(window.host_time).getTime()
const now = new Date().getTime()

if(host_time > now){
  document.getElementById("story_feedback_section").remove()
}

function onSubmitStory(){
    let url = window.location.pathname + "/story";
    event.preventDefault();
    let errorDiv = $("#div_story_error");
    errorDiv.empty();
    try{
        let story = $("#story").val();
        let storyDiv = $("#div_story");   

        story = isValidString(story);
        isValidStoryString(story);

        const requestConfig = {
            method: "POST",
            url: url,
            dataType: "json",
            data: {story: story},
        }

        $.ajax(requestConfig).then(function(responseMessage){
            if(responseMessage.success){
                storyDiv.empty();
                storyDiv.append(`<p class="fs-5 fw-bolder">Your Story</p>`);
                storyDiv.append(`<p class="fst-italic story" >${story}</p>`);
                storyDiv.append(`<btn class="btn btn-primary" onclick="onEditStory()">Edit</btn>`);
            }else{
                errorDiv.empty()
                errorDiv.append(`<span class="text-danger">${responseMessage.error}</span>`);
                errorDiv.show();
            }
        }) 
    }catch(error){
        errorDiv.empty()
        errorDiv.append(`<span class="text-danger">${error}</span>`);
        errorDiv.show();
    }
}

function onEditStory(){
    let storyDiv = $("#div_story");
    let story = storyDiv.find("p.story").text();
    storyDiv.empty();
    storyDiv.append(
        `<form id="story_form" action="/story" method="POST" onsubmit="onSubmitStory()" >
              <label class="labels" for="story">Share your Experience</label>
              <textarea
                rows="5"
                class="form-control"
                name="story"
                id="story"
                placeholder="Describe your experience with the event"
              >${story}</textarea>

              <div id="div_story_error" class="m-2 text-center"></div>

              <div class="m-2 text-center">
                <button
                  class="btn btn-primary profile-button"
                  type="submit"
                  id="btn_submit_story"
                  value="submit"
                >Submit</button>
              </div>
            </form>`
    )
}
function onSubmitFeedback(){
    let url = window.location.pathname + "/feedback";
    let isUser = window.isUser
    event.preventDefault();
    let errorDiv = $("#div_feedback_error");
    errorDiv.empty();
    let data = {}

    try{
        let feedback = $('#feedback').val();
        let feedbackDiv = $("#div_feedback");

        feedback = isValidString(feedback);
        isValidFeedbackString(feedback);

        if(isUser){
            data ={feedback: feedback}
        }else{
            let first_name = $('#first_name').val()
            first_name = isValidString(first_name)
            checkName(first_name)

            let last_name = $('#last_name').val()
            last_name = isValidString(last_name)
            checkName(last_name)

            let email = $('#email').val()
            email = isValidString(email.toLowerCase())
            checkEmail(email)
            
            data ={
                first_name: first_name,
                last_name: last_name,
                email: email,
                feedback: feedback
            }

        }

        let requestConfig = {
            method: "POST",
            url: url,
            dataType: "json",
            data: data
        }

        $.ajax(requestConfig).then(function(responseMessage){
            if(responseMessage.success){
                feedbackDiv.empty();
                feedbackDiv.append(`<span class="text-success">Thank you for submitting feedback!</span>`)
                // feedbackDiv.append(`<p class="fs-5 fw-bolder">Your Feedback</p>`);
                // feedbackDiv.append(`<p class="fst-italic feedback" >${feedback}</p>`);
                // feedbackDiv.append(`<btn class="btn btn-primary" onclick="onEditFeedback()">Edit</btn>`);
            }else{
                errorDiv.empty()
                errorDiv.append(`<span class="text-danger">${responseMessage.error}</span>`);
                errorDiv.show();
            }
        })

    }catch(error){
        errorDiv.empty()
        errorDiv.append(`<span class="text-danger">${error}</span>`);
        errorDiv.show();
    }
}

function onEditFeedback(){
    let feedbackDiv = $("#div_feedback");
    let feedback = feedbackDiv.find("p.feedback").text();
    feedbackDiv.empty();
    feedbackDiv.append(`
        <form id="feedback_form" action="/feedback" method="POST" onsubmit="onSubmitFeedback()" >
            <label class="labels" for="feedback">Feedback (will only be seen by the host)</label>
            <textarea
            rows="5"
            class="form-control"
            name="feedback"
            id="feedback"
            placeholder="Share any feedback you have for the host"
            ></textarea>
            <div id="div_feedback_error" class="m-2 text-center"></div>

            <div class="m-2 text-center">
                <button
                    class="btn btn-primary profile-button"
                    type="submit"
                    id="btn_submit_feedback"
                    value="submit"
                >Submit Feedback</button>
            </div>
        </form>
    `)
}

function isValidString(str) {
    if (!str) {
      throw "Story cannot be empty";
    }
    if (typeof str !== "string") {
      throw "Story must be a string";
    }
    str = str.trim();
    if (str.length == 0) {
      throw "Story cannot be empty string";
    }
    return str;
  }

function isValidStoryString(story){
    if(story.split(" ").length < 20){
        throw "Error: story must be at least 20 words long";
    }
}

function isValidFeedbackString(story){
    if(story.split(" ").length < 10){
        throw "Error: story must be at least 10 words long";
    }
}

function checkName(name){
    if(name.length < 2) throw "Name cannot be less than 2 characters";
    if(name.length > 25) throw "Name cannot be more than 25 characters";
    if(name.trim().length === 0) throw "Name cannot be empty";
    if(!isNaN(name)) throw "Name cannot be a number";
}

function checkEmail(email){
    email = email.toLowerCase();
    if(email.length < 5) throw "Email cannot be less than 5 characters";
    if(email.length > 50) throw "Email cannot be more than 50 characters";
    if(email.trim().length === 0) throw "Email cannot be empty";
    if(!isNaN(email)) throw "Email cannot be a number";
    if(!email.includes("@")) throw "Email must contain @";
    if(!email.includes(".")) throw "Email must contain .";  
  }