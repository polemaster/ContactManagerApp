using AutoMapper;
using backend.Models;

namespace backend.DTOs.Mappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<ContactCreationRequest, Contact>();
            CreateMap<ContactUpdateRequest, Contact>();
        }
    }
}
