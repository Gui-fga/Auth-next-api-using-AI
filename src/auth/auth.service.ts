import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private jwtService: JwtService) {}

  private users = [];

  async onModuleInit() {
    const hash = await bcrypt.hash('123456', 10);

    this.users = [
      {
        id: 1,
        email: 'gui@email.com',
        password: hash,
      },
    ];

    console.log('Usuário criado com senha hash:', hash);
  }

  async validateUser(email: string, pass: string) {
    const user = this.users.find(u => u.email === email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);

    console.log('Senha digitada:', pass);
    console.log('Hash salvo:', user.password);
    console.log('Match:', isMatch);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}