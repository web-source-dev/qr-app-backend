const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventDataSchema = new Schema({
  eventName: { type: String, required: true },
  since: { type: String, required: true },
  until: { type: String, required: true },
  fullDay: { type: Boolean, required: true },
  timeZone: { type: String, required: true },
  sinceTime: { type: String, required: function() { return !this.fullDay; } },
  untilTime: { type: String, required: function() { return !this.fullDay; } }
});

const eventSchema = new Schema({
  event_logo_qr: { type: String, required: true },
  event_name: { type: String, required: true },
  event_discription: { type: String, required: true },
  event_facilities: [{ type: String }],
  event_about: { type: String, required: true },
  event_contact_numbers: [{ type: String }],
  event_emails: [{ type: String }],
  event_welcome_screen: { type: String, required: true },
  event_welcome_screen_time: { type: Number, required: true },
  event_website_url: { type: String, required: true },
  event_organizer: { type: String, required: true },
  event_display_theme: { type: String, required: true },
  user_id: { type: String, required: true },
  event_data: [eventDataSchema]
});

module.exports = mongoose.model('Event', eventSchema);
