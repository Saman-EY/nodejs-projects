import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  findById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
  @Post("")
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }
}
