
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RolPermiso } from 'src/rol-permiso/schemas';


@Schema()
export class Rol extends Document {

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

  @Prop()
  permisos: [RolPermiso]

}



export const RolSchema = SchemaFactory.createForClass(Rol);


RolSchema.pre('save', async function (next) {
    const rol = this

    rol.createdAt = rol.createdAt || new Date();
    rol.updatedAt = new Date();

    return next()
});