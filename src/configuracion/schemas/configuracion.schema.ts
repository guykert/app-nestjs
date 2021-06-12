
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class Configuracion extends Document {

  @Prop({ unique: true, require: "Año Académico es obligatorio" })
  anio_academico: string;

  @Prop()
  anio_forzado: number;

  @Prop({ default:1})
  activo: boolean;

  @Prop()
  creadoPor: string;

  @Prop()
  modificadoPor: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

}



export const ConfiguracionSchema = SchemaFactory.createForClass(Configuracion);


ConfiguracionSchema.pre('save', async function (next) {
    const configuracion = this

    configuracion.createdAt = configuracion.createdAt || new Date();
    configuracion.updatedAt = new Date();

    return next()
});