
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema()
export class RolPermiso extends Document {

  @Prop({ unique: true, require: "Nombre es obligatorio" })
  nombre: string;

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



export const RolPermisoSchema = SchemaFactory.createForClass(RolPermiso);


RolPermisoSchema.pre('save', async function (next) {
    const rolPermiso = this

    rolPermiso.createdAt = rolPermiso.createdAt || new Date();
    rolPermiso.updatedAt = new Date();

    return next()
});