import { useState } from "react";

const ContactPage = () => {
  const [result,setResult]=useState("")

  const onSubmit = async (event)=>{
    event.preventDefault();
    setResult("Sending...")
    const formData= new FormData(event.target);
    formData.append("access_key","0697c845-b462-4a77-8f00-b3651f81c4e1");
    const response=await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
    const data = await response.json();
    if(data.success){
      setResult("Message Sent");
      event.target.reset()
    }else{
      console.log("Error", data);
      setResult(data.message)
    }
  }
  
  return (
    <>
      <div
        className="text-charcoal min-h-212"
      >
        <div className="flex justify-center pt-10">
          <h1 className="text-5xl font-bold">Contact Us</h1>
        </div>
        <div className="flex justify-center">
          <div className="w-1/2">
            <p className="text-center pt-5">
              Have a question, idea, or just want to say hi? We're always
              excited to hear from our community! Whether it's about upcoming
              events, tournaments, or just gaming in general, feel free to reach
              out.
            </p>
            <p className="text-center pt-5">
              Use the contact info below or drop us a message, and we'll get
              back to you as soon as possible. Your feedback helps us make
              QuestTogether the ultimate hub for gamers everywhere!
            </p>
          </div>
        </div>
        <div className="flex lg:mx-40 md:mx-20 mx-10 pt-30">
          <div className="w-1/2">
            <div className="border-b-1 border-darkbeige mx-2 mb-10 pb-10 w-4/5">
              <h1>📍 Address</h1>
              <p>42 Pixel Lane</p>
              <p>London, UK</p>
              <p>W1A 4ZZ</p>
            </div>
            <div className="border-b-1 border-darkbeige mx-2 mb-10 pb-10 w-4/5">
              <h1>📧 Email</h1>
              <p>contact@questtogether.gg</p>
            </div>
            <div className="border-b-1 border-darkbeige mx-2 mb-10 pb-10 w-4/5">
              <h1>📞 Phone Number</h1>
              <p>1-661-320-4146</p>
            </div>
          </div>
          <div className="w-1/2">
            <form onSubmit={onSubmit}>
              <div className="mb-2">
                <label htmlFor="name" className="text-xl">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                  required
                  className="w-full p-1 mt-2 bg-mutedwhite text-charcoal rounded-xl"
                />
              </div>
              <div className="my-2">
                <label htmlFor="email" className="text-xl">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your Email Address"
                  required
                  className="w-full p-1 mt-2 bg-mutedwhite text-charcoal rounded-xl"
                />
              </div>
              <div className="my-2">
                <label htmlFor="phone" className="text-xl">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="Phone Number (Optional)"
                  className="w-full p-1 mt-2 bg-mutedwhite text-charcoal rounded-xl"
                />
              </div>
              <div className="my-2">
                <label htmlFor="message" className="text-xl">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  placeholder="Write your message here"
                  required
                  className="w-full p-1 mt-2 bg-mutedwhite text-charcoal rounded-xl"
                />
              </div>
              <div className="flex justify-end py-5">
                <button
                  type="submit"
                  className="border-1 border-border px-2 rounded-2xl bg-linear-to-r from-blue-300 to-purple-300 w-full py-2 hover:cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            </form>
            <span>{result}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
