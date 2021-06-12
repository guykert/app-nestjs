
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document,  Mongoose,  Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Rol } from 'src/rol/schemas';
import { RolPermiso } from 'src/rol-permiso/schemas';


@Schema()
export class Usuario extends Document {

  @Prop({ unique: true, require: "Rut es obligatorio" })
  rut: string;

  @Prop({ require: "Nombre es obligatorio" })
  nombre: string;

  @Prop({ require: "Apellido Paterno es obligatorio" })
  apellido_paterno: string;

  @Prop()
  apellido_materno: string;

  @Prop({ default:1})
  activo: boolean;

  @Prop()
  id_zoom: string;

  @Prop()
  imagen: string;

  @Prop({ unique: true, require: "Correo Electrónico es obligatorio" })
  email: string;

  @Prop()
  password: string;

  @Prop()
  salt: string;

  @Prop()
  sexo: string;

  @Prop()
  telefono: string;

  @Prop()
  anio_predeterminado: string;

  @Prop({ default:""})
  entrar_como_id: string;

  @Prop({ default:""})
  colegio_predeterminado: string;

  @Prop({ default:""})
  rol_predeterminado: string;

  @Prop({ default:""})
  scanner_predeterminado: string;

  @Prop({ default:""})
  template_predeterminado: string;

  @Prop()
  edad: number;

  @Prop()
  creadoPor: string;

  @Prop()
  modificadoPor: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  roles: [Rol]

  @Prop()
  permisos: [RolPermiso]

}



export const UsuarioSchema = SchemaFactory.createForClass(Usuario);


UsuarioSchema.pre('save', async function (next) {
    const user = this

    user.createdAt = user.createdAt || new Date();
    user.updatedAt = new Date();

    if (this.isModified("password") || this.isNew) {

      user.salt = await bcrypt.genSalt(10);

      var new_password = user.rut.slice(0, -2);
  
      new_password = new_password.split("").reverse().join("");
  
      new_password = new_password.slice(0, 4);
  
      new_password = new_password.split("").reverse().join("");
  
      user.password = await bcrypt.hash(new_password, user.salt);

    } else {
      return next()
    }
  });