import { Controller, UseGuards } from "@nestjs/common";
import { BlogService } from "../services/blog.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGaurd } from "../../auth/guards/auth.guard";
import { CommentService } from "../services/comment.service";

@Controller("blog")
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGaurd)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}


}
