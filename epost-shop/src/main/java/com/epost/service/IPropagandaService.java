package com.epost.service;

import com.epost.common.ServerResponse;
import com.epost.pojo.Propaganda;
import com.epost.vo.PropagandaDetailVo;

public interface IPropagandaService {
    ServerResponse saveOrUpdatePropaganda(Propaganda propaganda);

    ServerResponse searchPropaganda(String propagandaName, int pageNum, int pageSize);

    ServerResponse getPropagandaList(int pageNum, int pageSize);

    ServerResponse<PropagandaDetailVo> managePropagandaDetail(Integer propagandaId);

    ServerResponse getBanner();
}
