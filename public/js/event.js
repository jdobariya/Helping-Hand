const host_time = new Date(window.host_time).getTime()
console.log(host_time)
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
                console.log(responseMessage.error);
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
    event.preventDefault();
    let errorDiv = $("#div_feedback_error");
    errorDiv.empty();
    
    try{
        let feedback = $('#feedback').val();
        let feedbackDiv = $("#div_feedback");

        feedback = isValidString(feedback);
        isValidFeedbackString(feedback);

        let requestConfig = {
            method: "POST",
            url: url,
            dataType: "json",
            data: {feedback: feedback}
        }

        $.ajax(requestConfig).then(function(responseMessage){
            if(responseMessage.success){
                feedbackDiv.empty();
                feedbackDiv.append(`<p class="fs-5 fw-bolder">Your Feedback</p>`);
                feedbackDiv.append(`<p class="fst-italic feedback" >${feedback}</p>`);
                feedbackDiv.append(`<btn class="btn btn-primary" onclick="onEditFeedback()">Edit</btn>`);
            }else{
                errorDiv.empty()
                errorDiv.append(`<span class="text-danger">${responseMessage.error}</span>`);
                errorDiv.show();
                console.log(responseMessage.error);
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