import { hash } from 'bcrypt';
import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class EmployeesService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly authService: AuthService,
  ) { }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await hash(password, saltOrRounds);
  }

  async create(createEmployeeDto: CreateEmployeeDto, tenantId: string) {
  
    const user = await this.userRepository.findOne({
      where: { email: createEmployeeDto.email, tenant: { id: tenantId } },
    })

    if (user) return new HttpException('Email used in this workspace', HttpStatus.CONFLICT)

    const saltOrRounds = 10;

    const hashedPassword = await hash(createEmployeeDto.password, saltOrRounds);
    return this.userRepository.save({
      ...createEmployeeDto,
      tenant: { id: tenantId },
      password: hashedPassword,
    });
  }
  async findAll(tenantId: string) {
    return await this.userRepository.find({
      where: { tenant: { id: tenantId } },
      select: ['id', 'name', 'email', 'role', 'created_at', 'updated_at'], // No incluir password
    });
  }

  async findOne(tenantId: string, id: string) {
    const user = await this.userRepository.findOne({
      where: { 
        id,
        tenant: { id: tenantId } 
      },
      select: ['id', 'name', 'email', 'role', 'created_at', 'updated_at'],
    });

    if (!user) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(tenantId: string, id: string, updateEmployDto: UpdateEmployeeDto) {
    const user = await this.userRepository.findOne({
      where: { 
        id,
        tenant: { id: tenantId } 
      },
    });

    if (!user) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    // Verificar si el nuevo email ya existe (si se está actualizando)
    if (updateEmployDto.email && updateEmployDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { 
          email: updateEmployDto.email,
          tenant: { id: tenantId } 
        },
      });

      if (existingUser) {
        throw new ConflictException('El nuevo email ya está registrado');
      }
    }

    // Hashear la nueva contraseña si se proporciona
    if (updateEmployDto.password) {
      updateEmployDto.password = await this.hashPassword(updateEmployDto.password);
    }

    // Actualizar el usuario
    await this.userRepository.update(
      { id, tenant: { id: tenantId } },
      updateEmployDto,
    );

    return this.findOne(tenantId, id); // Devuelve el usuario actualizado
  }

  async remove(tenantId: string, id: string) {
    const user = await this.userRepository.findOne({
      where: { 
        id,
        tenant: { id: tenantId } 
      },
    });

    if (!user) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    }

    await this.userRepository.remove(user);
    return { message: `Empleado con ID ${id} eliminado correctamente` };
  }

  // Método adicional para buscar por email (útil para autenticación)
  async findByEmail(tenantId: string, email: string) {
    return await this.userRepository.findOne({
      where: { 
        email,
        tenant: { id: tenantId } 
      },
    });
  }
}
