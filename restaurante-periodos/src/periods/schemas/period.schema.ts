import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'prueba1' })
export class Period extends Document {

  // ❗ NO declarar _id → Mongoose lo añade solo

  @Prop({ type: Object })
  restaurant_id: Record<string, any>;

  @Prop({ type: Object })
  user_id: Record<string, any>;

  @Prop({ type: Object })
  cdn_id: Record<string, any>;

  @Prop({ type: String })
  restaurant_name: string;

  @Prop({ type: String })
  cdn_restaurant_name: string;

  @Prop({ type: Date })
  start_date: Date;

  @Prop({ type: Date })
  final_date: Date;

  @Prop({ type: String })
  periodtype: string;

  @Prop({
    type: {
      _id: { type: Object },
      status_name: { type: String },
      description: { type: String },
      color: { type: String },
      background_color: { type: String },
      created_at: { type: Date },
      updated_at: { type: Date },
    }
  })
  status_Period: Record<string, any>;
}

export const PeriodSchema = SchemaFactory.createForClass(Period);
