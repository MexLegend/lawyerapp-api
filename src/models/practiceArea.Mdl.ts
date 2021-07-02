import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const SchemaM = Schema;

const practiceAreaModel = new SchemaM({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El autor es requerido']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  faq: [
    {
      answer: { type: String },
      question: { type: String }
    }
  ],
  is_category: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: [true, 'El Nombre del área de práctica / categoria es requerido']
  },
  processState: {
    type: String,
    required: false,
    default: 'AWAITING'
  },
  quotes: [
    {
      quote: {
        quoteType: {
          type: String,
          required: [true, 'El tipo de la cita es requerido']
        },
        quoteAuthor: { type: String, required: false },
        quotePageName: { type: String, required: false },
        quoteWebSiteName: { type: String, required: false },
        quoteYear: { type: String, required: false },
        quoteMonth: { type: String, required: false },
        quoteDay: { type: String, required: false },
        quoteUrl: { type: String, required: false },
        quoteTitle: { type: String, required: false },
        quoteCity: { type: String, required: false },
        quotePublisher: { type: String, required: false },
        quoteCaseNumber: { type: String, required: false },
        quoteCourt: { type: String, required: false },
        quotePages: { type: String, required: false },
        quotePeriodicalTitle: { type: String, required: false },
        quoteJournalName: { type: String, required: false },
        quoteInventor: { type: String, required: false },
        quoteCountry: { type: String, required: false },
        quotePatentNumber: { type: String, required: false },
        required: false
      }
    }
  ],
  review: {
    type: String,
    required: false
  },
  status: {
    type: Boolean,
    default: true
  }
});

practiceAreaModel.plugin(mongoosePaginate);
export default model('PracticeArea', practiceAreaModel);
